<?php

namespace App\Http\Controllers\APIs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Exception;

/**
 * @OA\Tag(
 *     name="Categories",
 *     description="Endpoints para gestión de categorías"
 * )
 */
class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @OA\Get(
     *     path="/api/categories",
     *     summary="Listar todas las categorías",
     *     tags={"Categories"},
     *     operationId="getCategoriesList",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de categorías obtenida exitosamente",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Electrónicos"),
     *                 @OA\Property(property="description", type="string", example="Productos electrónicos"),
     *                 @OA\Property(property="created_at", type="string", format="datetime"),
     *                 @OA\Property(property="updated_at", type="string", format="datetime")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @OA\Post(
     *     path="/api/categories/create",
     *     summary="Crear una nueva categoría",
     *     tags={"Categories"},
     *     operationId="createCategory",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="Electrónicos"),
     *             @OA\Property(property="description", type="string", example="Productos electrónicos")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Categoría registrada exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="La categoria fue registrada con exito")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            $category = new Category();
            $category->name = $request->name;
            $category->description = $request->description;
            $category->save();

            return response()->json(['status' => true, 'message' => 'La categoria fue registrada con exito']);
        } catch (Exception $exc) {
            return response()->json(['status' => false, 'message' => 'Existe errores al registrar la categoria' . $exc->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @OA\Get(
     *     path="/api/categories/show/{id}",
     *     summary="Mostrar una categoría específica",
     *     tags={"Categories"},
     *     operationId="showCategory",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la categoría",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Categoría encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Electrónicos"),
     *             @OA\Property(property="description", type="string", example="Productos electrónicos")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Categoría no encontrada"
     *     )
     * )
     */
    public function show(string $id)
    {
        $category = Category::find($id);
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     *
     * @OA\Put(
     *     path="/api/categories/edit/{id}",
     *     summary="Actualizar una categoría existente",
     *     tags={"Categories"},
     *     operationId="updateCategory",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la categoría",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Electrónicos Actualizado"),
     *             @OA\Property(property="description", type="string", example="Productos electrónicos actualizados")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Categoría actualizada exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="La categoria fue actualizada con exito")
     *         )
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        try {
            $category = Category::find($id);
            $category->name = $request->name;
            $category->description = $request->description;
            $category->save();
            return response()->json(['status' => true, 'message' => 'La categoria fue actualizada con exito']);
        } catch (Exception $exc) {
            return response()->json(['status' => false, 'message' => 'Error al actualizar la categoria']);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @OA\Delete(
     *     path="/api/categories/delete/{id}",
     *     summary="Eliminar una categoría",
     *     tags={"Categories"},
     *     operationId="deleteCategory",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la categoría a eliminar",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Categoría eliminada exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="La categoria fue eliminada con exito")
     *         )
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);
        $category->delete();
        return response()->json(['status' => true, 'message' => 'La categoria fue eliminada con exito']);
    }
}
