<?php namespace kak\widgets\colorpicker\bundles;


use yii\web\AssetBundle;

class DisplacejsAsset extends AssetBundle
{
    public $sourcePath = '@npm/displacejs/dist';
    
    public $js = [
        'displace.js'
    ];
}