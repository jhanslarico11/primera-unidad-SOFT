<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'dni')) {
                $table->string('dni', 8)->nullable()->unique()->after('id');
            }

            if (!Schema::hasColumn('users', 'nombres')) {
                $table->string('nombres', 100)->nullable()->after('name');
            }

            if (!Schema::hasColumn('users', 'apellido_paterno')) {
                $table->string('apellido_paterno', 100)->nullable()->after('nombres');
            }

            if (!Schema::hasColumn('users', 'apellido_materno')) {
                $table->string('apellido_materno', 100)->nullable()->after('apellido_paterno');
            }
        });

        Schema::table('clients', function (Blueprint $table) {
            if (!Schema::hasColumn('clients', 'nombres')) {
                $table->string('nombres', 100)->nullable()->after('full_name');
            }

            if (!Schema::hasColumn('clients', 'apellido_paterno')) {
                $table->string('apellido_paterno', 100)->nullable()->after('nombres');
            }

            if (!Schema::hasColumn('clients', 'apellido_materno')) {
                $table->string('apellido_materno', 100)->nullable()->after('apellido_paterno');
            }

        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            if (Schema::hasColumn('clients', 'apellido_materno')) {
                $table->dropColumn('apellido_materno');
            }

            if (Schema::hasColumn('clients', 'apellido_paterno')) {
                $table->dropColumn('apellido_paterno');
            }

            if (Schema::hasColumn('clients', 'nombres')) {
                $table->dropColumn('nombres');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'apellido_materno')) {
                $table->dropColumn('apellido_materno');
            }

            if (Schema::hasColumn('users', 'apellido_paterno')) {
                $table->dropColumn('apellido_paterno');
            }

            if (Schema::hasColumn('users', 'nombres')) {
                $table->dropColumn('nombres');
            }

            if (Schema::hasColumn('users', 'dni')) {
                $table->dropUnique('users_dni_unique');
                $table->dropColumn('dni');
            }
        });
    }
};
