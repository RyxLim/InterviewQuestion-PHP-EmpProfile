<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('myKad')->unique();
            $table->enum('gender', ['male', 'female', 'other']);
            $table->string('maritalStatus');
            $table->string('phone');
            $table->string('email')->unique();
            $table->text('address');
            $table->date('dateOfBirth');
            $table->string('nationality');
            $table->date('hireDate');
            $table->string('department');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
};
