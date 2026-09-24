<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class AdminUserRequest extends FormRequest {
    public function authorize(): bool { return $this->user()?->role==='super_admin'; }
    public function rules(): array { return [
        'name'=>'required|string|max:160','email'=>['required','email',Rule::unique('users')->ignore($this->route('id'))],
        'password'=>[$this->isMethod('post')?'required':'nullable','string','min:10','max:255'],
        'role'=>['required',Rule::in(['traveler','destination_manager','government','super_admin'])],
        'active'=>'required|boolean','destinationId'=>'nullable|exists:destinations,id','institution'=>'nullable|string|max:255',
        'pointsBalance'=>'prohibited','user_id'=>'prohibited',
    ]; }
}
