<?php namespace kak\widgets\colorpicker\bundles;

use yii\web\AssetBundle;

/**
 * Class InputGradientAsset
 * @package kak\widgets\colorpicker\bundles
 */
class InputGradientAsset extends AssetBundle
{
    public $sourcePath = '@vendor/kak/colorpicker/assets/gradientpicker';

    public $depends = [
        'yii\web\JqueryAsset',
    ];

    public $css = [
        'kak-gradientpicker.css'
    ];
    
    public $js = [
        'kak-gradientpicker.js'
    ];

}