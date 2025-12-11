import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Access denied. Vendor role required." }, { status: 403 })
    }

    const vendorId = session.user.id

    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: vendorId }
    })

    if (!vendorProfile) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    // Get current month and last month dates
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const lastMonth = new Date(currentMonth)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    // Get products stats
    const totalProducts = await prisma.product.count({
      where: {
        VendorProfile: {
          some: {
            id: vendorProfile.id
          }
        }
      }
    })

    const approvedProducts = await prisma.product.count({
      where: {
        VendorProfile: {
          some: {
            id: vendorProfile.id
          }
        },
        isDeleted: false
      }
    })

    const pendingProducts = totalProducts - approvedProducts

    // Get orders stats
    const totalOrders = await prisma.productOrderItem.count({
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        }
      }
    })

    const pendingOrders = await prisma.productOrderItem.count({
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        },
        order: {
          status: 'PENDING'
        }
      }
    })

    const packingOrders = await prisma.productOrderItem.count({
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        },
        order: {
          status: 'PROCESSING'
        }
      }
    })

    // Get earnings stats
    const currentMonthEarnings = await prisma.productOrderItem.aggregate({
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        },
        order: {
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
          createdAt: { gte: currentMonth }
        }
      },
      _sum: {
        price: true
      }
    })

    const lastMonthEarnings = await prisma.productOrderItem.aggregate({
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        },
        order: {
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
          createdAt: {
            gte: lastMonth,
            lt: currentMonth
          }
        }
      },
      _sum: {
        price: true
      }
    })

    const totalEarnings = await prisma.productOrderItem.aggregate({
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        },
        order: {
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] }
        }
      },
      _sum: {
        price: true
      }
    })

    // Calculate earnings change percentage
    const currentMonthRevenue = parseFloat((currentMonthEarnings._sum.price || 0).toString())
    const lastMonthRevenue = parseFloat((lastMonthEarnings._sum.price || 0).toString())
    const totalRevenue = parseFloat((totalEarnings._sum.price || 0).toString())

    const earningsChange = lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0

    // Get recent orders
    const recentOrders = await prisma.productOrderItem.findMany({
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        }
      },
      include: {
        order: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        product: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        order: {
          createdAt: 'desc'
        }
      },
      take: 5
    })

    const formattedRecentOrders = recentOrders.map(item => ({
      id: item.order.id,
      orderNumber: item.order.orderNumber,
      customerName: item.order.user.name,
      amount: parseFloat(item.price.toString()) * item.quantity,
      status: item.order.status,
      packagingStatus: item.order.status === 'PROCESSING' ? 'IN_PROGRESS' : 'PENDING',
      createdAt: item.order.createdAt,
    }))

    // Get top products
    const topProducts = await prisma.productOrderItem.groupBy({
      by: ['productId'],
      where: {
        product: {
          VendorProfile: {
            some: {
              id: vendorProfile.id
            }
          }
        }
      },
      _sum: {
        quantity: true,
        price: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })

    const formattedTopProducts = []
    for (const item of topProducts) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true }
      })
      
      if (product) {
        formattedTopProducts.push({
          id: item.productId,
          name: product.name,
          sales: item._sum.quantity || 0,
          earnings: parseFloat((item._sum.price || 0).toString()),
        })
      }
    }

    // Generate earnings chart (last 6 months)
    const earningsChart = []
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date()
      monthDate.setMonth(monthDate.getMonth() - i)
      monthDate.setDate(1)
      monthDate.setHours(0, 0, 0, 0)
      
      const nextMonth = new Date(monthDate)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      const monthEarnings = await prisma.productOrderItem.aggregate({
        where: {
          product: {
            VendorProfile: {
              some: {
                id: vendorProfile.id
              }
            }
          },
          order: {
            status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
            createdAt: {
              gte: monthDate,
              lt: nextMonth
            }
          }
        },
        _sum: {
          price: true
        }
      })

      earningsChart.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        earnings: parseFloat((monthEarnings._sum.price || 0).toString())
      })
    }

    // Get order status distribution - removed unused query
    // const orderStatusCounts = await prisma.productOrderItem.groupBy({
    //   by: ['orderId'],
    //   where: {
    //     product: {
    //       VendorProfile: {
    //         some: {
    //           id: vendorProfile.id
    //         }
    //       }
    //     }
    //   },
    //   _count: {
    //     id: true
    //   }
    // })

    // Get actual order status counts
    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      where: {
        items: {
          some: {
            product: {
              VendorProfile: {
                some: {
                  id: vendorProfile.id
                }
              }
            }
          }
        }
      },
      _count: {
        id: true
      }
    })

    const orderStatusChart = statusCounts.map(status => ({
      status: status.status,
      count: status._count.id,
      color: getStatusColor(status.status)
    }))

    const dashboardData = {
      stats: {
        totalProducts,
        approvedProducts,
        pendingProducts,
        totalOrders,
        pendingOrders,
        packingOrders,
        totalEarnings: totalRevenue,
        monthlyEarnings: currentMonthRevenue,
        earningsChange,
      },
      recentOrders: formattedRecentOrders,
      topProducts: formattedTopProducts,
      earningsChart,
      orderStatusChart,
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error("Error fetching vendor dashboard:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING': return '#FFA500'
    case 'PROCESSING': return '#0080FF'
    case 'SHIPPED': return '#8000FF'
    case 'DELIVERED': return '#00FF00'
    case 'COMPLETED': return '#00AA00'
    case 'CANCELLED': return '#FF0000'
    default: return '#888888'
  }
}