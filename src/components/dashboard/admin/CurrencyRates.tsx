import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Save, RefreshCw } from "lucide-react";
import { useCurrency } from "@/lib/currencyContext";
import { useLanguage } from "@/lib/languageContext";

const formSchema = z.object({
  usdToIqd: z.coerce.number().positive("Rate must be positive"),
  sarToIqd: z.coerce.number().positive("Rate must be positive"),
  usdToSar: z.coerce.number().positive("Rate must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

const CurrencyRates = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { exchangeRates, setExchangeRates } = useCurrency();
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usdToIqd: exchangeRates.usdToIqd,
      sarToIqd: exchangeRates.sarToIqd,
      usdToSar: exchangeRates.usdToSar,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Update the exchange rates in the context and database
      const result = await setExchangeRates({
        usdToIqd: data.usdToIqd,
        sarToIqd: data.sarToIqd,
        usdToSar: data.usdToSar,
      });

      if (result.success) {
        toast({
          title: t("currencyRates"),
          description: "The exchange rates have been updated successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description:
            result.error ||
            "Failed to update currency rates in database. Local rates updated.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update currency rates. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLatestRates = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch the latest rates from an API
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      // Sample response with slightly different rates
      const response = {
        usdToIqd: 1462.5,
        sarToIqd: 390.0,
        usdToSar: 3.75,
      };

      form.reset(response);
      setLastUpdated(new Date());

      toast({
        title: "Rates fetched successfully",
        description: "The latest exchange rates have been fetched.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fetch failed",
        description: "Failed to fetch latest rates. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("currencyRates")}</CardTitle>
        <CardDescription>{t("manageCurrencyRates")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">
            {t("lastUpdated")} {lastUpdated.toLocaleString()}
          </p>
          <Button
            variant="outline"
            onClick={fetchLatestRates}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("fetchLatestRates")}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="usdToIqd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("usdToIqdRate")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1460.00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>1 USD = ? IQD</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sarToIqd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sarToIqdRate")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="389.33"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>1 SAR = ? IQD</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usdToSar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("usdToSarRate")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="3.75"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>1 USD = ? SAR</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-6" />

            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-2">{t("conversionPreview")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">100 USD =</p>
                  <p className="font-medium">
                    {(form.watch("usdToIqd") * 100).toLocaleString()} IQD
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">100 SAR =</p>
                  <p className="font-medium">
                    {(form.watch("sarToIqd") * 100).toLocaleString()} IQD
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">100 USD =</p>
                  <p className="font-medium">
                    {(form.watch("usdToSar") * 100).toLocaleString()} SAR
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? t("saving") : t("saveRates")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CurrencyRates;
