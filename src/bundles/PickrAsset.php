<?php namespace kak\widgets\colorpicker\bundles;

use yii\web\AssetBundle;

/**
 * Class PickrAsset
 * @package kak\widgets\colorpicker\bundles
 */
class PickrAsset extends AssetBundle
{
    public $sourcePath = '@vendor/kak/colorpicker/assets/pickr';
    public $js = [
        'pickr.min.js'
    ];
        
    public function setTheme($theme = 'monolith'){
        $this->css = [
            sprintf('themes/%s.min.css', $theme)
        ];
    }
}