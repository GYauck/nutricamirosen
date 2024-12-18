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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NutritionPieChart from "@/components/nutrition-chart.component";

const formSchema = z.object({
  age: z.coerce
    .number({ invalid_type_error: "Debe ingresar un número válido" })
    .min(1, { message: "La edad debe ser un número positivo" })
    .max(150, { message: "Por favor, ingrese una edad válida" }),
  sex: z.enum(["male", "female"], {
    required_error: "Por favor, seleccione su sexo",
  }),
  height: z.coerce
    .number({ invalid_type_error: "Debe ingresar un número válido" })
    .min(50, { message: "Altura debe ser al menos 50 cm" })
    .max(250, { message: "Por favor, ingrese una altura válida" }),
  weight: z.coerce
    .number({ invalid_type_error: "Debe ingresar un número válido" })
    .min(20, { message: "Peso debe ser al menos 20 kg" })
    .max(250, { message: "Por favor, ingrese un peso válido" }),
  goal: z.enum(["loseWeight", "gainMuscle"], {
    required_error: "Por favor, selecciona un objetivo",
  }),
});

// Menus based on different nutritional needs
const MENUS = {
  hypocaloric: {
    title: "Menú bajo en calorías",
    description:
      "Menú bajo en calorías y alto en proteínas diseñado para bajar grasa corporal.",
    meals: [
      {
        name: "Bife de cerdo con cebollas caramelizadas",
        calories: 610,
        protein: 52,
        imgUrl: "/menus/CaramelizedOnionAppleJusRoastedPork.webp",
      },
      {
        name: "Bife con arroz yamani y brócoli",
        calories: 510,
        protein: 48,
        imgUrl: "/menus/Steak&BrownRice.webp",
      },
      {
        name: "Pastel de carne con papas rústicas",
        calories: 750,
        protein: 55,
        imgUrl: "/menus/CottagePie.webp",
      },
    ],
  },
  hypercaloricHyperproteic: {
    title: "Menú de Aumento de Masa Muscular",
    description: "Alto en proteínas y calorías para desarrollo muscular.",
    meals: [
      {
        name: "Empandas de pollo con cebolla caramelizada",
        calories: 1036,
        protein: 59,
        imgUrl: "/menus/empanadas.png",
      },
      {
        name: "Souffle de calabaza con albóndigas",
        calories: 971,
        protein: 67.4,
        imgUrl: "/menus/suffleAlbondigas.png",
      },
      {
        name: "Mousse de tofu con batata y chocolate",
        calories: 329.6,
        protein: 31,
        imgUrl: "/menus/mousseTofu.png",
      },
    ],
  },
};

const MainFormPage = () => {
  const [selectedMenu, setSelectedMenu] = useState<keyof typeof MENUS | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<
    "home" | "pickup" | null
  >(null);

  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: undefined,
      sex: undefined,
      height: undefined,
      weight: undefined,
      goal: undefined,
    },
  });

  // Determine menu based on form data
  const determineMenu = (data: z.infer<typeof formSchema>) => {
    const { goal } = data;

    if (goal === "loseWeight") {
      return "hypocaloric";
    }

    if (goal === "gainMuscle") {
      return "hypercaloricHyperproteic";
    }

    return null;
  };

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form, form.formState.isSubmitSuccessful]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const menu = determineMenu(data);
    setSelectedMenu(menu);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMenu(null);
  };

  return (
    <div className="flex flex-col items-center">
      <img className="w-28 lg:w-56" src="/logo.png" alt="" />
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex items-center">
          <CardTitle className="font-bold">Formulario de Nutrición</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Age Field */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingresa tu edad"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sex Field */}
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu sexo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Hombre</SelectItem>
                        <SelectItem value="female">Mujer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Height Field */}
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingresa tu altura"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Weight Field */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingresa tu peso"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Activity Level Field */}
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cual es tu objetivo?</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu objetivo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="loseWeight">Bajar peso</SelectItem>
                        <SelectItem value="gainMuscle">
                          Aumentar masa muscular
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600"
              >
                Obtener Menu
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {selectedMenu && (
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-xl w-[95%] max-h-[90vh] flex flex-col overflow-y-auto rounded-lg">
            <DialogHeader className="p-6 pb-0 items-center">
              <DialogTitle>{MENUS[selectedMenu].title}</DialogTitle>
              <DialogDescription>
                {MENUS[selectedMenu].description}
              </DialogDescription>
            </DialogHeader>

            {/* Grid of Meal Images */}
            <div className="grid grid-cols-3 gap-4 p-4">
              {MENUS[selectedMenu].meals.map((meal, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={meal.imgUrl}
                    alt={meal.name}
                    width={200}
                    height={100}
                    className="object-cover rounded-md"
                  />
                  <div className="text-center mt-2">
                    <p className="font-semibold text-sm">{meal.name}</p>
                    <div className="md:hidden flex ">
                    <ul>
                      <li className="text-xs text-gray-600">
                        ~{meal.calories} cal
                      </li>
                      <li className="text-xs text-gray-600">
                        ~{meal.protein}g proteína
                      </li>
                    </ul>

                    
                    </div>
                    <p className="text-sm text-gray-600 hidden md:block">
                      {meal.calories} cal | {meal.protein}g proteína
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className=" md:p-6 pt-0 flex w-full">
              <div>
                {selectedMenu && <NutritionPieChart menuType={selectedMenu} />}
              </div>
            </div>

            {/* Add Checkboxes and Button */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={deliveryOption === "home"}
                    onChange={() => setDeliveryOption("home")}
                    className="checkbox"
                  />
                  Enviar a domicilio
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={deliveryOption === "pickup"}
                    onChange={() => setDeliveryOption("pickup")}
                    className="checkbox"
                  />
                  Retiro en local
                </label>
              </div>
              <button
                onClick={() => {
                  // Perform action on button click
                  handleCloseDialog();
                  setDeliveryOption(null);
                }}
                disabled={!deliveryOption}
                className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded ${
                  !deliveryOption ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Enviar
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MainFormPage;
