"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BurnOption } from "@/types";

const formSchema = z.object({
  name: z.string().min(3, "Proposal name must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  applicantName: z.string().min(2, "Name must be at least 2 characters"),
  applicantAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  burnOption: z.enum(["BACK", "GCC", "ADDRESS"]),
  burnAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address").optional(),
});

export default function CreateProposal() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      content: "",
      applicantName: "",
      applicantAddress: "",
      burnOption: "BACK",
    },
  });

  const burnOption = form.watch("burnOption");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // TODO: Implement actual proposal creation
    console.log(values);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter proposal name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your proposal"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="font-semibold">Applicant Information</h3>
                  <FormField
                    control={form.control}
                    name="applicantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicantAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ethereum Address</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="burnOption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Burn Option</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select burn option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BACK">Back</SelectItem>
                          <SelectItem value="GCC">GCC</SelectItem>
                          <SelectItem value="ADDRESS">Address</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {burnOption === "ADDRESS" && (
                  <FormField
                    control={form.control}
                    name="burnAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Burn Address</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Proposal"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}