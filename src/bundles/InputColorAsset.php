<?php namespace kak\widgets\colorpicker\bundles;

use yii\web\AssetBundle;

/**
 * Class InputColorAsset
 * @package kak\widgets\colorpicker\bundles
 */
class InputColorAsset extends AssetBundle
{
    public $sourcePath = '@vendor/kak/colorpicker/assets/colorpicker';

    public $depends = [
        'yii\web\JqueryAsset',
    ];

    public $js = [
        'kak-colorpicker.js'
    ];

}