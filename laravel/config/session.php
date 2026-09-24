<?php
return ['driver'=>'file','lifetime'=>120,'encrypt'=>false,'files'=>storage_path('framework/sessions'),'cookie'=>'takono_session','path'=>'/','domain'=>null,'secure'=>env('APP_ENV')==='production','http_only'=>true,'same_site'=>'lax'];
