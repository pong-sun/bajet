<?php

namespace Database\Seeders\Pocket;

use App\Models\Pocket;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PocketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (User::all() as $user) {
            $random = rand(999, 9999);
            Pocket::create([
                'user_id' => $user->id,
                'name' => $user->first_name . ' Pocket',
                'schedule' => "monthly",
                'schedule_date' => "2022-09-03",
                'amount' => $random,
                'amount_to_pay' => $random,
                'is_active' => true
            ]);
        }
    }
}