<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Exception;

class CategoryController extends Controller
{
    private const CATEGORY_MESSAGE = 'La categoria ';

    public function index()
    {
        $categories = Category::orderBy('name', 'ASC')->get();
        return Inertia::render('Categories/Index', ['categories' => $categories]);
    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|min:3|max:35'
        ]);

        try {
            $category = new Category();
            $category->name = $request->name;
            $category->description = $request->description;
            $category->save();

            return Redirect::route('categories.index')->with([
                'status' => true,
                'message' => self::CATEGORY_MESSAGE . $category->name . ' fue registrada correctamente'
            ]);
        } catch (Exception $exc) {
            return Redirect::route('categories.index')->with([
                'status' => false,
                'message' => 'Existen errores en el formulario.'
            ]);
        }
    }

    public function show(string $id)
    {
        $category = Category::find($id);
        return Inertia::render('Categories/Show', ['category' => $category]);
    }

    public function edit(string $id)
    {
        $category = Category::findOrFail($id);
        return Inertia::render('Categories/Edit', ['category' => $category]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|min:3|max:35'
        ]);

        try {
            $category = Category::findOrFail($id);
            $category->name = $request->name;
            $category->description = $request->description;
            $category->save();

            return Redirect::route('categories.index')->with([
                'status' => true,
                'message' => self::CATEGORY_MESSAGE . $category->name . ' fue actualizada correctamente'
            ]);
        } catch (Exception $exc) {
            return Redirect::route('categories.index')->with([
                'status' => false,
                'message' => 'Existen errores en el formulario.'
            ]);
        }
    }

    public function destroy(string $id)
    {
        try {
            $category = Category::findOrFail($id);
            $categoryName = $category->name;
            $category->delete();

            return Redirect::route('categories.index')->with([
                'status' => true,
                'message' => self::CATEGORY_MESSAGE . $categoryName . ' fue eliminada correctamente'
            ]);
        } catch (Exception $exc) {
            return Redirect::route('categories.index')->with([
                'status' => false,
                'message' => 'No se pudo eliminar la categoria.'
            ]);
        }
    }
}
