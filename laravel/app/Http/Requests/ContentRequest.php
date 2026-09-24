<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
class ContentRequest extends FormRequest {
    public function authorize(): bool {
        if (!in_array($this->user()?->role,['destination_manager','super_admin'],true)) return false;
        return $this->user()->role==='super_admin' || !$this->query('destinationId') || (string)$this->user()->destination_id===(string)$this->query('destinationId');
    }
    protected function prepareForValidation(): void {
        $data=[]; foreach($this->getInputSource()->all() as $k=>$v) $data[Str::snake($k)]=$v; $this->replace($data);
    }
    public function validationData(): array { return $this->getInputSource()->all(); }
    public function rules(): array {
        $kind=$this->route('kind') ?? 'destination';
        $text=['required','string','max:10000']; $name=['required','string','max:160'];
        $image=['nullable','string','max:255','regex:~^(https?://|/(?!/))~'];
        $rules=['id'=>'prohibited','user_id'=>'prohibited','role'=>'prohibited','secure_token'=>'prohibited','claimed_count'=>'prohibited','points_balance'=>'prohibited','stock'=>'prohibited'];
        $rules['destination_id']='prohibited';
        $rules += $kind==='events' ? [
            'title'=>$name,'description'=>$text,'image'=>$image,'start_date'=>'required|date_format:Y-m-d','end_date'=>'required|date_format:Y-m-d|after_or_equal:start_date',
            'time'=>'required|string|max:255','location'=>'required|string|max:255','organizer'=>'nullable|string|max:255','points_reward'=>'required|integer|min:0|max:1000',
            'status'=>['required',Rule::in(['draft','published','upcoming','completed'])],
        ] : ($kind==='rewards' ? [
            'name'=>$name,'description'=>$text,'image'=>$image,'partner'=>$name,'points_required'=>'required|integer|min:0|max:1000000',
            'quota'=>'required|integer|min:0|max:1000000','valid_from'=>'nullable|date_format:Y-m-d','valid_until'=>'required|date_format:Y-m-d|after_or_equal:valid_from',
            'status'=>['required',Rule::in(['active','inactive','expired','out_of_stock'])],'terms'=>'nullable|array','terms.*'=>'string|max:2000',
        ] : ($kind==='local-discoveries' ? [
            'name'=>$name,'description'=>$text,'image'=>$image,'category'=>['required',Rule::in(['Kuliner','Oleh-oleh','Produk Lokal','Lainnya'])],
            'address'=>'required|string|max:255','latitude'=>'required|numeric|between:-90,90','longitude'=>'required|numeric|between:-180,180',
            'operating_hours'=>'nullable|string|max:255','contact'=>'nullable|string|max:255','promotion'=>'nullable|string|max:255','reward_text'=>'nullable|string|max:255',
            'points_reward'=>'required|integer|min:0|max:1000','status'=>['required',Rule::in(['draft','published'])],
        ] : ($kind==='explore-points' ? [
            'name'=>$name,'description'=>$text,'image'=>$image,'category'=>['required',Rule::in(['Edukasi','Sejarah','Budaya','Kuliner','Keluarga','Alam','Foto','Santai'])],
            'story'=>'nullable|string|max:50000','educational_content'=>'nullable|string|max:50000','fun_facts'=>'nullable|array','fun_facts.*'=>'string|max:2000',
            'latitude'=>'required|numeric|between:-90,90','longitude'=>'required|numeric|between:-180,180','estimated_duration'=>'required|string|max:255',
            'difficulty'=>['required',Rule::in(['Mudah','Sedang','Menantang'])],'points_reward'=>'required|integer|min:0|max:1000','status'=>['required',Rule::in(['draft','published'])],
            'quiz'=>'nullable|array:title,questions','quiz.title'=>'required_with:quiz|string|max:160','quiz.questions'=>'required_with:quiz|array|min:1|max:20',
            'quiz.questions.*.id'=>'required|string|distinct|max:80','quiz.questions.*.question'=>$text,
            'quiz.questions.*.options'=>'required|array|min:2|max:8','quiz.questions.*.options.*.id'=>'required|string|max:80','quiz.questions.*.options.*.text'=>$name,
            'quiz.questions.*.correctOptionId'=>'required|string','quiz.questions.*.explanation'=>$text,'quiz.questions.*.points'=>'required|integer|min:0|max:1000',
        ] : [
            'name'=>$name,'description'=>$text,'hero_image'=>$image,'tagline'=>'nullable|string|max:255','gallery'=>'nullable|array|max:30','gallery.*'=>$image,
            'address'=>'required|string|max:255','city'=>'required|string|max:255','province'=>'required|string|max:255',
            'latitude'=>'required|numeric|between:-90,90','longitude'=>'required|numeric|between:-180,180','operating_hours'=>'nullable|string|max:255',
            'ticket_info'=>'nullable|string|max:255','contact_phone'=>'nullable|string|max:255','contact_email'=>'nullable|email|max:255',
            'status'=>['required',Rule::in(['draft','published'])],'facilities'=>'nullable|array|max:100','facilities.*.id'=>'required|string|distinct',
            'facilities.*.name'=>$name,'facilities.*.icon'=>'required|string|max:60','facilities.*.latitude'=>'required|numeric|between:-90,90','facilities.*.longitude'=>'required|numeric|between:-180,180','facilities.*.description'=>'nullable|string|max:2000',
        ])));
        return $rules;
    }
    public function after(): array {
        return [function($validator) {
            foreach($this->input('quiz.questions',[]) as $i=>$q) {
                $ids=array_column($q['options']??[],'id');
                if(count($ids)!==count(array_unique($ids)) || !in_array($q['correctOptionId']??null,$ids,true)) $validator->errors()->add("quiz.questions.$i",'Pilihan kuis harus unik dan memuat jawaban benar.');
            }
        }];
    }
}
