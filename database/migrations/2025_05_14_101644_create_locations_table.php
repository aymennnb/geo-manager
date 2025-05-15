<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocationsTable extends Migration
{
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sitef_id')->constrained('sitesf')->onDelete('cascade');

            $table->string('exploitant')->nullable();
            $table->string('bailleur')->nullable();
            $table->date('date_effet')->nullable();
            $table->string('duree_bail')->nullable();
            $table->float('loyer_actuel')->nullable();
            $table->float('taux_revision')->nullable();
            $table->date('prochaine_revision')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
}
