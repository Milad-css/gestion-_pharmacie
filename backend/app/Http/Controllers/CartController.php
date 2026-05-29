<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = $request->user()
            ->cartItems()
            ->with('product.category')
            ->get();

        $total = $items->sum(fn ($item) => $item->product->prix * $item->quantite);

        return response()->json([
            'items' => $items,
            'total' => $total,
        ]);
    }

    public function add(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantite' => 'integer|min:1',
        ]);

        $item = $request->user()->cartItems()
            ->where('product_id', $data['product_id'])
            ->first();

        if ($item) {
            $item->increment('quantite', $data['quantite'] ?? 1);
        } else {
            $item = $request->user()->cartItems()->create([
                'product_id' => $data['product_id'],
                'quantite' => $data['quantite'] ?? 1,
            ]);
        }

        return response()->json($item->load('product'), 201);
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->authorize($cartItem, $request);

        $data = $request->validate([
            'quantite' => 'required|integer|min:1',
        ]);

        $cartItem->update($data);

        return response()->json($cartItem->load('product'));
    }

    public function remove(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->authorize($cartItem, $request);

        $cartItem->delete();

        return response()->json(null, 204);
    }

    public function clear(Request $request): JsonResponse
    {
        $request->user()->cartItems()->delete();

        return response()->json(null, 204);
    }

    private function authorize(CartItem $cartItem, Request $request): void
    {
        abort_if($cartItem->user_id !== $request->user()->id, 403, 'Accès refusé.');
    }
}
