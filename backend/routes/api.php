<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\VerificationController;
use App\Http\Controllers\User\ForgotPasswordController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

//------------------All-Public-Routes------------------//
Route::group(['prefix' => '/v1'], function () {
    Route::get('/', function () {
        return 'You\'re currently at the version 1 of this api';
    });

    // User Routes. 
    Route::post('/users', [UserController::class, 'register']);
    Route::post('/users/login', [UserController::class, 'login']);
    Route::get('/users/email/verify', [VerificationController::class, 'verify'])->name('verification.verify');
    Route::get('/users/email/resend', [VerificationController::class, 'resend'])->name('verification.resend');
    Route::post('/users/forgot-password', [ForgotPasswordController::class, 'forgot'])->name('password.forgot');
    Route::post('/users/reset-password', [ForgotPasswordController::class, 'reset'])->name('password.reset');
});

//------------------All-Private-Routes------------------//
Route::group([
    'middleware' => ['auth:sanctum', 'verified'],
    'prefix' => '/v1'
], function () {
    // User Routes.
    Route::resource('/users', UserController::class)
        ->only(['index', 'show']);
    Route::put('/users', [UserController::class, 'update']);
    Route::put('/users/avatar', [UserController::class, 'updateAvatar']);
    Route::post('/users/logout', [UserController::class, 'logout']);
});
