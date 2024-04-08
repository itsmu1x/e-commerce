"use client"

import { accountSettings } from "@/actions/auth"
import { useAuth } from "@/components/contexts/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { accountSettingsSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export default function Page() {
    const user = useAuth()
    const form = useForm<z.infer<typeof accountSettingsSchema>>({
        resolver: zodResolver(accountSettingsSchema),
        defaultValues: {
            email: user.email,
            name: user.name,
            confirmPassword: "",
            oldPassword: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof accountSettingsSchema>) {
        const response = await accountSettings(values)
        if (response) {
            toast.error(response)
        } else {
            toast.success("Changes saved!")
            form.reset({
                name: values.name,
                email: values.email,
            })
        }
    }

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
                method="POST"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="name">Full name</FormLabel>
                            <FormControl>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    {...field}
                                />
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
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <FormControl>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    autoComplete="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Card>
                    <CardContent className="mt-4 space-y-6">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="oldPassword">
                                        Current password (leave blank to leave
                                        unchanged)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="oldPassword"
                                            type="password"
                                            placeholder="********"
                                            autoComplete="current-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="password">
                                        New password (leave blank to leave
                                        unchanged)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="********"
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="password">
                                        Confirm new password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="********"
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Button type="submit">Save changes</Button>
            </form>
        </Form>
    )
}
