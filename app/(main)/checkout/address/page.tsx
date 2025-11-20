"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { debounce } from "lodash";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  pincode: z.string().length(6, { message: "Pincode must be exactly 6 digits" }),
});

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type Address = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
};

export default function CheckoutAddressPage() {
  const { items, totalPrice } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const response = await fetch("/api/checkout/address");
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }
        const data = await response.json();
        setSavedAddresses(data.addresses);
        if (data.addresses.length === 0) {
          setShowNewAddressForm(true);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Failed to load saved addresses");
      }
    };

    fetchSavedAddresses();
  }, []);

  const verifyPincode = useCallback(
    debounce(async (pincode: string) => {
      if (pincode.length === 6) {
        try {
          const response = await fetch(`/api/kyc/verify/pincode?pincode=${pincode}`);
          const data = await response.json();

          if (response.ok && data.success) {
            form.setValue("city", data.data.district || "");
            form.setValue("state", data.data.state || "");
            toast.success("Pincode verified successfully");
          } else {
            toast.error(data.message || "Invalid pincode");
            form.setError("pincode", { message: data.message || "Invalid pincode" });
          }
        } catch (error) {
          toast.error("Failed to verify pincode");
          console.error("Pincode verification error:", error);
        }
      }
    }, 500),
    [form]
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (selectedAddressId) {
        // Use existing address
        router.push(`/checkout/payment?addressId=${selectedAddressId}`);
      } else {
        // Save new address
        const response = await fetch("/api/checkout/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save address");
        }

        const data = await response.json();
        form.reset();
        toast.success("Address saved successfully");
        router.push(`/checkout/payment?addressId=${data.address.id}`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to process address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Shipping Address</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <RadioGroup
                    value={selectedAddressId}
                    onValueChange={(value) => {
                      setSelectedAddressId(value);
                      setShowNewAddressForm(false);
                    }}
                  >
                    {savedAddresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-2 mb-4 p-4 border rounded">
                        <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                        <div className="flex-1">
                          <p className="font-medium">{address.fullName}</p>
                          <p>{address.addressLine1}</p>
                          <p>{`${address.city}, ${address.state} ${address.zip}`}</p>
                          <p>{address.phone}</p>
                          <p>{address.email}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSelectedAddressId("");
                      setShowNewAddressForm(true);
                    }}
                  >
                    Add New Address
                  </Button>
                </div>
              )}

              {(showNewAddressForm || savedAddresses.length === 0) && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="vinod454@gmail.com"
                              type="email"
                               {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="9876543210" {...field} 
                            minLength={10}
                            maxLength={10}
                            type="tel"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="123 Main St, Apartment 4B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        disabled={true}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Purnia" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        disabled={true}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="Bihar" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="854301"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  verifyPincode(e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Continue to Payment"
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {selectedAddressId && (
                <Button
                  type="button"
                  className="w-full mt-4"
                  onClick={() => router.push(`/checkout/payment?addressId=${selectedAddressId}`)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty.</p>
              ) : (
                <>
                  {items.map((item:CartItem) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
