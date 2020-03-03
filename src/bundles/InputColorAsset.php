<?php namespace kak\widgets\colorpicker\bundles;

use yii\web\AssetBundle;
use yii\web\JqueryAsset;

/**
 * Class InputColorAsset
 * @package kak\widgets\colorpicker\bundles
 */
class InputColorAsset extends AssetBundle
{
    public $sourcePath = '@vendor/kak/colorpicker/assets/colorpicker';

    public $depends = [
        JqueryAsset::class,
    ];

    public $js = [
        'kak-colorpicker.js'
    ];

}