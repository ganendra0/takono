<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\{AdminUserRequest,ContentRequest};
use App\Models\{User,Destination,AuditLog,UserActivity};
use App\Support\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class AdminController extends Controller {
    public function index() { return Api::ok(['users'=>User::all(),'destinations'=>Destination::all(),'roles'=>['traveler','destination_manager','government','super_admin'],'auditLogs'=>AuditLog::latest('id')->limit(200)->get(),'activityCount'=>UserActivity::count()]); }
    public function save(AdminUserRequest $r,?string $id=null) {
        return DB::transaction(function()use($r,$id) {
            $v=$r->validated();
            abort_if($id===(string)$r->user()->id && ($v['role']!=='super_admin'||!$v['active']),422,'Admin tidak dapat menonaktifkan atau menurunkan akses akun sendiri.');
            abort_if($v['role']==='destination_manager' && empty($v['destinationId']),422,'Pilih destinasi manager.');
            $v['destination_id']=$v['role']==='destination_manager'?$v['destinationId']:null; unset($v['destinationId']);
            if(empty($v['password'])) unset($v['password']);
            $u=$id?User::lockForUpdate()->findOrFail($id):new User;
            $u->fill($v);
            $revoke=$u->isDirty(['role','active','destination_id','password']);
            $u->save();
            if($revoke) $u->tokens()->delete();
            AuditLog::create(['user_id'=>$r->user()->id,'action'=>$id?'update':'create','resource'=>'users','resource_id'=>(string)$u->id,'changes'=>array_values(array_diff(array_keys($v),['password']))]);
            return Api::ok($u,$id?200:201);
        });
    }
    public function destination(ContentRequest $r) {
        return DB::transaction(function()use($r) {
            $v=$r->validated(); $v['slug']=Str::slug($v['name']).'-'.Str::lower(Str::random(6)); $v['code']=strtoupper(Str::random(10));
            $d=Destination::create($v);
            AuditLog::create(['user_id'=>$r->user()->id,'action'=>'create','resource'=>'destinations','resource_id'=>(string)$d->id]);
            return Api::ok($d,201);
        });
    }
}
