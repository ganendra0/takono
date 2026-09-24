<?php
namespace App\Support;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Str;
class Api {
    public static function data($value) {
        if ($value instanceof Arrayable) $value = $value->toArray();
        if (!is_array($value)) return $value;
        $out = [];
        foreach ($value as $key => $item) {
            $name = is_string($key) ? Str::camel($key) : $key;
            $out[$name] = self::data($item);
            if (($name === 'id' || str_ends_with((string)$name, 'Id')) && $item !== null) $out[$name] = (string)$item;
        }
        return $out;
    }
    public static function ok($data = null, int $status = 200) {
        return response()->json(['success' => true, 'data' => self::data($data)], $status);
    }
    public static function point($point, bool $manager = false) {
        $data = self::data($point);
        if (!$manager) {
            unset($data['secureToken']);
            if (isset($data['quiz']['questions'])) {
                foreach ($data['quiz']['questions'] as &$q) unset($q['correctOptionId'], $q['explanation']);
            }
        }
        return $data;
    }
}
