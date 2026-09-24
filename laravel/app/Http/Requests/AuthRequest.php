<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class AuthRequest extends FormRequest {
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'email' => ['required','email','max:255'],
            'password' => ['required','string', $this->is('api/auth/register') ? 'min:10' : 'min:1', 'max:255'],
            'name' => [$this->is('api/auth/register') ? 'required' : 'sometimes','string','max:160'],
            'role' => ['prohibited'], 'user_id' => ['prohibited'], 'destination_id' => ['prohibited'],
        ];
    }
}
