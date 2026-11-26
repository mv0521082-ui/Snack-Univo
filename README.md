# Snack-Univo — Máquina Expendedora de Refrigerios

## Integrantes
* **Juan José Saravia Soto** — Código: `U20260774`
* **Didier Humberto Zamora Palacios** — Código: `U20260716`
* **Jeferson Isai Ramirez Mata** — Código: `U20261005`
* **Manuel De Jesús Villalobos Meza** — Código: `U20260797`

## Descripción del Proyecto
Aplicación para gestionar el inventario, catálogo y ventas de una máquina expendedora de refrigerios (**Snack-Univo**), desarrollada con TypeScript e interfaces tipadas. Incluye una versión de consola con operaciones CRUD y persistencia en JSON, y una versión web con formularios, búsqueda y filtrado de productos, cálculo de ingresos y unidades vendidas, y actualización del DOM a partir de un catálogo inicial de al menos seis registros.

## Reglas Principales
* Acepta cantidades enteras mayores que cero.
* No vende más unidades que las disponibles.
* Las reposiciones de inventario no generan ingresos; cambiar el precio de un producto no altera las ventas anteriores.

## Instrucciones de Ejecución

### Versión de Consola
1. Compilar el código TypeScript:
   ```bash
   npx tsc