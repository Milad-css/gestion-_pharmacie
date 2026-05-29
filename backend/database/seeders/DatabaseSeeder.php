<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin Pharmacie',
            'email' => 'admin@pharmacie.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'telephone' => '0555000000',
            'adresse' => '1 Rue de la Santé, Alger',
        ]);

        // Client test
        User::create([
            'name' => 'Client Test',
            'email' => 'client@test.com',
            'password' => Hash::make('password'),
            'role' => 'client',
        ]);

        $categories = [
            ['nom' => 'Analgésiques', 'description' => 'Médicaments contre la douleur'],
            ['nom' => 'Antibiotiques', 'description' => 'Médicaments contre les infections bactériennes'],
            ['nom' => 'Vitamines & Compléments', 'description' => 'Suppléments nutritionnels et vitamines'],
            ['nom' => 'Dermatologie', 'description' => 'Soins pour la peau'],
            ['nom' => 'Cardiologie', 'description' => 'Médicaments cardiovasculaires'],
            ['nom' => 'Diabétologie', 'description' => 'Gestion du diabète'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        $products = [
            ['category_id' => 1, 'nom' => 'Paracétamol 500mg', 'description' => 'Antalgique et antipyrétique. Boîte de 16 comprimés.', 'prix' => 120.00, 'stock' => 200, 'date_expiration' => '2027-06-01'],
            ['category_id' => 1, 'nom' => 'Ibuprofène 400mg', 'description' => 'Anti-inflammatoire non stéroïdien. Boîte de 30 comprimés.', 'prix' => 180.00, 'stock' => 150, 'date_expiration' => '2027-03-15'],
            ['category_id' => 1, 'nom' => 'Aspirine 500mg', 'description' => 'Analgésique et antipyrétique. Boîte de 20 comprimés.', 'prix' => 90.00, 'stock' => 180, 'date_expiration' => '2026-12-01'],
            ['category_id' => 2, 'nom' => 'Amoxicilline 500mg', 'description' => 'Antibiotique à large spectre. Boîte de 14 gélules.', 'prix' => 350.00, 'stock' => 80, 'date_expiration' => '2026-09-01'],
            ['category_id' => 2, 'nom' => 'Azithromycine 250mg', 'description' => 'Antibiotique macrolide. Boîte de 6 comprimés.', 'prix' => 480.00, 'stock' => 60, 'date_expiration' => '2026-11-30'],
            ['category_id' => 3, 'nom' => 'Vitamine C 1000mg', 'description' => 'Complément en vitamine C effervescent. Tube de 20 comprimés.', 'prix' => 220.00, 'stock' => 300, 'date_expiration' => '2027-08-01'],
            ['category_id' => 3, 'nom' => 'Vitamine D3 1000 UI', 'description' => 'Supplément en vitamine D3. Flacon de 60 gélules.', 'prix' => 450.00, 'stock' => 120, 'date_expiration' => '2027-04-15'],
            ['category_id' => 3, 'nom' => 'Magnésium B6', 'description' => 'Complément en magnésium avec vitamine B6. Boîte de 45 comprimés.', 'prix' => 380.00, 'stock' => 90, 'date_expiration' => '2027-01-01'],
            ['category_id' => 4, 'nom' => 'Biafine Émulsion', 'description' => 'Émulsion pour brûlures légères. Tube 93g.', 'prix' => 290.00, 'stock' => 70, 'date_expiration' => '2027-07-01'],
            ['category_id' => 4, 'nom' => 'Cetaphil Crème Hydratante', 'description' => 'Crème hydratante pour peaux sensibles. Pot 250ml.', 'prix' => 650.00, 'stock' => 50, 'date_expiration' => '2028-01-01'],
            ['category_id' => 5, 'nom' => 'Amlodipine 5mg', 'description' => 'Antihypertenseur. Boîte de 30 comprimés.', 'prix' => 280.00, 'stock' => 100, 'date_expiration' => '2027-02-28'],
            ['category_id' => 6, 'nom' => 'Metformine 850mg', 'description' => 'Antidiabétique oral. Boîte de 60 comprimés.', 'prix' => 195.00, 'stock' => 130, 'date_expiration' => '2027-05-01'],
        ];

        foreach ($products as $p) {
            Product::create($p);
        }
    }
}
