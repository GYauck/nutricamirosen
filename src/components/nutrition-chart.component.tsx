import React from "react";
import { PieChart, Pie, Cell } from "recharts";

// Copy the MENUS type from the original file
type Menu = {
  title: string;
  description: string;
  meals: Array<{
    name: string;
    calories: number;
    protein: number;
    imgUrl: string;
  }>;
};

type MenusType = {
  hypocaloric: Menu;
  hypercaloricHyperproteic: Menu;
};

// Recreate the MENUS object with the same structure
const MENUS: MenusType = {
  hypocaloric: {
    title: "Menú bajo en calorías",
    description:
      "Menú bajo en calorías y alto en proteínas diseñado para bajar grasa corporal.",
    meals: [
      {
        name: "Bife de cerdo con cebollas caramelizadas",
        calories: 290,
        protein: 40,
        imgUrl: "/menus/CaramelizedOnionAppleJusRoastedPork.webp",
      },
      {
        name: "Bife con arroz yamani y brócoli",
        calories: 200,
        protein: 10,
        imgUrl: "/menus/Steak&BrownRice.webp",
      },
      {
        name: "Pastel de carne con papas rústicas",
        calories: 250,
        protein: 25,
        imgUrl: "/menus/CottagePie.webp",
      },
    ],
  },
  hypercaloricHyperproteic: {
    title: "Menú de Aumento de Masa Muscular",
    description: "Menú alto en proteínas y calorías para desarrollo muscular.",
    meals: [
      {
        name: "Empandas de pollo con cebolla caramelizada",
        calories: 257,
        protein: 17.1,
        imgUrl: "/menus/empanadas.png",
      },
      {
        name: "Souffle de calabaza con albondigas",
        calories: 362,
        protein: 31.3,
        imgUrl: "/menus/suffleAlbondigas.png",
      },
      {
        name: "Mousse de tofu con batata y chocolate",
        calories: 250,
        protein: 9,
        imgUrl: "/menus/mousseTofu.png",
      },
    ],
  },
};

// Define type for macros
type Macros = {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
};

// Extend the Menu type with macros
type MenuWithMacros = Menu & { macros: Macros };

const MENUS_WITH_MACROS: Record<keyof typeof MENUS, MenuWithMacros> = {
  hypocaloric: {
    ...MENUS.hypocaloric,
    macros: {
      protein: 65,
      carbs: 35,
      fats: 21,
      calories: 670,
    },
  },
  hypercaloricHyperproteic: {
    ...MENUS.hypercaloricHyperproteic,
    macros: {
      protein: 57.4,
      carbs: 85,
      fats: 31,
      calories: 869,
    },
  },
};

type NutritionPieChartProps = {
  menuType: keyof typeof MENUS;
};

const NutritionPieChart: React.FC<NutritionPieChartProps> = ({ menuType }) => {
  const menu = MENUS_WITH_MACROS[menuType];

  if (!menu) return null;

  const { protein, carbs, fats } = menu.macros;

  // Convertir macronutrientes a calorías
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatsCalories = fats * 9;

  const totalCalories = proteinCalories + carbsCalories + fatsCalories;

  const data = [
    {
      name: "Proteínas",
      value: protein,
      color: "#FF6384",
      percentage: ((proteinCalories / totalCalories) * 100).toFixed(1),
    },
    {
      name: "Carbohidratos",
      value: carbs,
      color: "#36A2EB",
      percentage: ((carbsCalories / totalCalories) * 100).toFixed(1),
    },
    {
      name: "Grasas",
      value: fats,
      color: "#FFCE56",
      percentage: ((fatsCalories / totalCalories) * 100).toFixed(1),
    },
  ];

  return (
    <div className="flex items-center w-full">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Perfil Nutricional</h3>
        <div className="relative w-48 h-48">
          <PieChart
            width={192}
            height={192}
            className="outline-none focus:outline-none"
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              className="outline-none focus:outline-none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-xs">Promedio</p>
            <p className="text-md font-bold">{totalCalories}cal.</p>
            <p className="text-xs ">Total</p>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center ">
            <div
              className="w-3 h-3 mr-1"
              style={{ backgroundColor: item.color }}
            />
            <span>
              {item.name}: {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionPieChart;
