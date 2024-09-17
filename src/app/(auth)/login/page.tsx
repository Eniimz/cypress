"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "@/lib/types";
import { Input } from "@/components/ui/input";
import logo from "../../../../public/cypresslogo.svg";
import { Button } from "@/components/ui/button";
import { actionLoginUser } from "@/lib/server-actions/auth-actions";

const LoginPage = () => {
  const router = useRouter();

  const [submitError, setSubmitError] = useState("");

  type formFields = z.infer<typeof FormSchema>;

  const form = useForm<z.infer<typeof FormSchema>>({
    // useForm returns functions like register, handlesubmit and objects like formState etc..
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "", password: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (formData) => {
    
    console.log("the subit handler is running...");

    const {error } = await actionLoginUser(formData);

    if(error){
        form.reset();
        setSubmitError(error.message)
    }

    router.replace('/dashboard')
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-[400px] gap-4 justify-center"
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => {
          if (submitError) {
            setSubmitError("");
          }
        }}
      >
        <Link href="/" className="flex items-center w-fit">
          <Image src={logo} alt="logoImg" width={50} height={50} />

          <span className="font-semibold text-4xl first-letter:ml-2">
            Cypress
          </span>
        </Link>

        <FormDescription>All in one collaboration tool</FormDescription>

        <FormField
          disabled={isLoading}
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading}
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        {/* { submitError && <FormMessage> {submitError} </FormMessage> } */}

        <Button type="submit" disabled={isLoading}>
          {" "}
          Login{" "}
        </Button>

        <span className="flex justify-between">
          <p>Dont have an account?</p>

          <Link href="/signup" className="text-primary">
            {" "}
            Sign up{" "}
          </Link>
        </span>
      </form>
    </Form>
  );
};

export default LoginPage;
