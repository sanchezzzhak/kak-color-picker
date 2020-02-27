<?php namespace kak\widgets\colorpicker\bundles;

use yii\web\AssetBundle;

/**
 * Class PickrAsset
 * @package kak\widgets\colorpicker\bundles
 */
class PickrAsset extends AssetBundle
{
    public $sourcePath = '@npm/simonwep--pickr/dist';
    public $js = [
        'pickr.min.js'
    ];
        
    public function setTheme($theme = 'monolith'){
        $this->css = [
            sprintf('themes/%s.min.css', $theme)
        ];
    }
}