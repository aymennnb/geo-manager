<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropForeign(['sitef_id']); // Supprimer la contrainte de clé étrangère
        });
    }

    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->foreign('sitef_id')->references('id')->on('sitesf')->onDelete('cascade');
        });
    }
};
