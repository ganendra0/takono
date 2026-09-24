<?php
namespace App\Policies;
use App\Models\User;
use App\Models\Destination;
class DestinationPolicy {
    public function manage(User $user, Destination $destination): bool {
        return $user->active && ($user->role === 'super_admin' || ($user->role === 'destination_manager' && (string)$user->destination_id === (string)$destination->id));
    }
}
