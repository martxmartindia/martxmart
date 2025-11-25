import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/utils/auth";
import { sendOTP } from "@/utils/messageSender";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    // Customer Mobile OTP Provider (Legacy - kept for backward compatibility)
    CredentialsProvider({
      id: "customer-mobile-otp",
      name: "Customer Mobile OTP",
      credentials: {
        phone: { label: "Phone Number", type: "tel" },
        otp: { label: "OTP Code", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.phone || !credentials?.otp) {
          return null;
        }

        try {
          // Find the latest pending OTP for this phone
          const otpRecord = await prisma.oTPCode.findFirst({
            where: {
              phone: credentials.phone.replace(/^\+?91/, "").trim(),
              code: credentials.otp,
              purpose: "CUSTOMER_LOGIN",
              status: "PENDING",
              expiresAt: {
                gt: new Date(),
              },
              isUsed: false,
            },
          });

          if (!otpRecord) {
            return null;
          }

          // Mark OTP as used
          await prisma.oTPCode.update({
            where: { id: otpRecord.id },
            data: {
              status: "VERIFIED",
              isUsed: true,
              usedAt: new Date(),
            },
          });

          // Find or create user
          let user = await prisma.user.findUnique({
            where: { phone: credentials.phone.replace(/^\+?91/, "").trim() },
          });

          if (!user) {
            // Create new customer user
            user = await prisma.user.create({
              data: {
                phone: credentials.phone.replace(/^\+?91/, "").trim(),
                name: `Customer ${credentials.phone.slice(-4)}`, // Use last 4 digits as name
                role: "CUSTOMER",
                isVerified: true,
              },
            });
          } else if (user.role !== "CUSTOMER") {
            // User exists but not a customer
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("Customer Mobile OTP authorization error:", error);
          return null;
        }
      },
    }),

    // New Secure Customer Credentials Provider (Phone + Password)
    CredentialsProvider({
      id: "customer-secure-phone",
      name: "Customer Phone & Password",
      credentials: {
        phone: { label: "Phone Number", type: "tel" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        try {
          const cleanPhone = credentials.phone.replace(/^\+?91/, "").trim();
          
          // Find verified customer user by phone
          const user = await prisma.user.findUnique({
            where: { 
              phone: cleanPhone,
              role: "CUSTOMER",
              isVerified: true,
              isDeleted: false,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("Secure customer phone credentials authorization error:", error);
          return null;
        }
      },
    }),

    // New Secure Customer Credentials Provider (Email + Password)
    CredentialsProvider({
      id: "customer-secure-email",
      name: "Customer Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find verified customer user by email
          const user = await prisma.user.findUnique({
            where: { 
              email: credentials.email.toLowerCase(),
              role: "CUSTOMER",
              isVerified: true,
              isDeleted: false,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("Secure customer email credentials authorization error:", error);
          return null;
        }
      },
    }),

    // Legacy Customer Credentials Provider (Phone + Password) - Backward compatibility
    CredentialsProvider({
      id: "customer-phone-credentials",
      name: "Customer Phone Credentials",
      credentials: {
        phone: { label: "Phone Number", type: "tel" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        try {
          const cleanPhone = credentials.phone.replace(/^\+?91/, "").trim();
          
          // Find customer user by phone
          const user = await prisma.user.findUnique({
            where: { phone: cleanPhone },
          });

          if (!user || user.role !== "CUSTOMER" || !user.password) {
            return null;
          }

          // Verify password
          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("Customer phone credentials authorization error:", error);
          return null;
        }
      },
    }),

    // Legacy Customer Credentials Provider (Email + Password) - Backward compatibility
    CredentialsProvider({
      id: "customer-email-credentials",
      name: "Customer Email Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find customer user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || user.role !== "CUSTOMER" || !user.password) {
            return null;
          }

          // Verify password
          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("Customer email credentials authorization error:", error);
          return null;
        }
      },
    }),

    // Admin Credentials Provider
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find admin user
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || user.role !== "ADMIN" || !user.password) {
            return null;
          }

          // Verify password
          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("Admin credentials authorization error:", error);
          return null;
        }
      },
    }),

    // Author Credentials Provider
    CredentialsProvider({
      id: "author-credentials",
      name: "Author Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find author user
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || user.role !== "AUTHOR" || !user.password) {
            return null;
          }

          // Verify password
          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("Author credentials authorization error:", error);
          return null;
        }
      },
    }),

    // Franchise Credentials Provider
    CredentialsProvider({
      id: "franchise-credentials",
      name: "Franchise Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find franchise user
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || user.role !== "FRANCHISE" || !user.password) {
            return null;
          }

          // Verify password
          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("Franchise credentials authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.phone = user.phone ?? undefined;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle role-based redirects after successful login
      if (url.startsWith("/")) {
        return baseUrl + url;
      } else if (url.startsWith("http")) {
        return url;
      } else {
        return baseUrl;
      }
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`);
    },
    async signOut({ token, session }) {
      console.log(`User ${session?.user?.email} signed out`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};

// Helper functions for OTP management
export async function generateAndSendOTP(phone: string, email: string, purpose: string) {
  const cleanPhone = phone ? phone.replace(/^\+?91/, "").trim() : null;
  const cleanEmail = email ? email.toLowerCase().trim() : null;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    // Clean up existing OTPs for this phone/email and purpose
    const orConditions: any[] = [];
    
    if (cleanPhone) {
      orConditions.push({ phone: cleanPhone });
    }
    
    if (cleanEmail) {
      orConditions.push({ email: cleanEmail });
    }

    // If neither phone nor email is provided, return error
    if (orConditions.length === 0) {
      return { success: false, message: "Phone or email is required" };
    }

    const updateData: any = {
      where: {
        OR: orConditions,
        purpose: purpose as any,
        status: "PENDING",
        isUsed: false,
      },
      data: {
        status: "EXPIRED",
      },
    };

    await prisma.oTPCode.updateMany(updateData);

    // Create new OTP record
    const otpData: any = {
      code: otp,
      purpose: purpose as any,
      expiresAt,
    };

    if (cleanPhone) otpData.phone = cleanPhone;
    if (cleanEmail) otpData.email = cleanEmail;

    await prisma.oTPCode.create({
      data: otpData,
    });

    // Send OTP via SMS only
    if (cleanPhone) {
      const smsResult = await sendOTP(cleanPhone, otp);
      if (smsResult.type === "error") {
        console.error("SMS OTP failed:", smsResult.message);
        throw new Error(smsResult.message);
      }
    } else {
      return { success: false, message: "Phone number is required" };
    }

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("OTP generation/sending error:", error);
    return { success: false, message: "Failed to send OTP" };
  }
}

export async function verifyOTP(phone: string, otp: string, purpose: string) {
  const cleanPhone = phone ? phone.replace(/^\+?91/, "").trim() : null;

  try {
    if (!cleanPhone) {
      return { success: false, message: "Phone number is required" };
    }

    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        phone: cleanPhone,
        code: otp,
        purpose: purpose as any,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
        isUsed: false,
      },
    });

    if (!otpRecord) {
      return { success: false, message: "Invalid or expired OTP" };
    }

    // Mark OTP as verified
    await prisma.oTPCode.update({
      where: { id: otpRecord.id },
      data: {
        status: "VERIFIED",
        isUsed: true,
        usedAt: new Date(),
      },
    });

    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    console.error("OTP verification error:", error);
    return { success: false, message: "OTP verification failed" };
  }
}