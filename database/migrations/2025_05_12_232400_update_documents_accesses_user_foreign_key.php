<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('documents_accesses', function (Blueprint $table) {
            // Supprimer la contrainte existante si elle existe
            $table->dropForeign(['user_id']);

            // Ajouter la contrainte avec cascade
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('documents_accesses', function (Blueprint $table) {
            // Pour revenir en arrière, supprimer la contrainte de suppression en cascade
            $table->dropForeign(['user_id']);

            // Revenir à la contrainte initiale sans cascade (optionnel)
            $table->foreign('user_id')
                ->references('id')
                ->on('users');
        });
    }

};
