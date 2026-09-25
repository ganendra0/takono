<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class ProfileRequest extends FormRequest {
    protected function prepareForValidation(): void { $this->merge(['password_confirmation'=>$this->input('passwordConfirmation')]); }
    public function authorize(): bool { return (bool)$this->user(); }
    public function rules(): array { return [
        'name'=>'required|string|max:160',
        'currentPassword'=>'required_with:password|string',
        'password'=>'nullable|string|min:10|max:255|confirmed',
    ]; }
}
