<?php namespace kak\widgets\colorpicker\bundles;

use yii\web\AssetBundle;
use yii\web\JqueryAsset;
/**
 * Class InputGradientAsset
 * @package kak\widgets\colorpicker\bundles
 */
class InputGradientAsset extends AssetBundle
{
    public $sourcePath = '@vendor/kak/colorpicker/assets/gradientpicker';

    public $depends = [
        JqueryAsset::class,
        DisplacejsAsset::class
    ];

    public $css = [
        'kak-gradientpicker.css'
    ];
    
    public $js = [
        'kak-gradientpicker.js'
    ];

}