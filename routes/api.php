<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use OpenApi\Annotations as OA;

use App\Http\Controllers\APIs\CategoryController;
use App\Http\Controllers\APIs\Resports\ProductsStockController;
use App\Http\Controllers\APIs\Resports\ClientController;

/**
 * @OA\Info(
 *      title="API Ventas Web",
 *      version="1.0.0",
 *      description="Documentación Swagger del sistema de ventas"
 * )
 */

/**
 * @OA\Get(
 *     path="/api/categories",
 *     summary="Listar categorías",
 *     tags={"Categorias"},
 *     @OA\Response(
 *         response=200,
 *         description="Lista de categorías"
 *     )
 * )
 */
Route::get('/categories', [CategoryController::class, 'index']);

/**
 * @OA\Post(
 *     path="/api/categories/create",
 *     summary="Crear categoría",
 *     tags={"Categorias"},
 *     @OA\Response(
 *         response=200,
 *         description="Categoría creada"
 *     )
 * )
 */
Route::post('/categories/create', [CategoryController::class, 'store']);

/**
 * @OA\Get(
 *     path="/api/categories/show/{id}",
 *     summary="Mostrar categoría",
 *     tags={"Categorias"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Categoría encontrada"
 *     )
 * )
 */
Route::get('/categories/show/{id}', [CategoryController::class, 'show']);

/**
 * @OA\Put(
 *     path="/api/categories/edit/{id}",
 *     summary="Editar categoría",
 *     tags={"Categorias"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Categoría actualizada"
 *     )
 * )
 */
Route::put('/categories/edit/{id}', [CategoryController::class, 'update']);

/**
 * @OA\Delete(
 *     path="/api/categories/delete/{id}",
 *     summary="Eliminar categoría",
 *     tags={"Categorias"},
 *     @OA\Response(
 *         response=200,
 *         description="Categoría eliminada"
 *     )
 * )
 */
Route::delete('/categories/delete/{id}', [CategoryController::class, 'destroy']);

/**
 * @OA\Get(
 *     path="/api/reports/stockProducts",
 *     summary="Reporte stock productos",
 *     tags={"Reportes"},
 *     @OA\Response(
 *         response=200,
 *         description="Reporte generado"
 *     )
 * )
 */
Route::get('/reports/stockProducts', [ProductsStockController::class, 'list']);

/**
 * @OA\Get(
 *     path="/api/reports/clients",
 *     summary="Reporte clientes",
 *     tags={"Reportes"},
 *     @OA\Response(
 *         response=200,
 *         description="Reporte clientes"
 *     )
 * )
 */
Route::get('/reports/clients', [ClientController::class, 'list']);

/**
 * @OA\Get(
 *     path="/api/user",
 *     summary="Usuario autenticado",
 *     tags={"Auth"},
 *     @OA\Response(
 *         response=200,
 *         description="Usuario logueado"
 *     )
 * )
 */
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
