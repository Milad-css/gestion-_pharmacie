<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()
            ->orders()
            ->with('items.product')
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        abort_if(
            $order->user_id !== $request->user()->id && ! $request->user()->isAdmin(),
            403,
            'Accès refusé.'
        );

        return response()->json($order->load('items.product'));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'adresse' => 'nullable|string|max:500',
            'telephone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        $cartItems = $request->user()->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Le panier est vide.'], 422);
        }

        foreach ($cartItems as $item) {
            if ($item->product->stock < $item->quantite) {
                return response()->json([
                    'message' => "Stock insuffisant pour \"{$item->product->nom}\".",
                ], 422);
            }
        }

        $order = DB::transaction(function () use ($request, $cartItems) {
            $total = $cartItems->sum(fn ($item) => $item->product->prix * $item->quantite);

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total' => $total,
                'statut' => 'en_attente',
                'adresse' => $request->adresse,
                'telephone' => $request->telephone,
                'notes' => $request->notes,
            ]);

            foreach ($cartItems as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantite' => $item->quantite,
                    'prix_unitaire' => $item->product->prix,
                ]);

                $item->product->decrement('stock', $item->quantite);
            }

            $request->user()->cartItems()->delete();

            return $order;
        });

        return response()->json($order->load('items.product'), 201);
    }

    // Admin only
    public function adminIndex(): JsonResponse
    {
        $orders = Order::with(['user', 'items.product'])->latest()->paginate(20);

        return response()->json($orders);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $data = $request->validate([
            'statut' => 'required|in:en_attente,confirmee,livree,annulee',
        ]);

        $order->update($data);

        return response()->json($order->load('items.product', 'user'));
    }
}
