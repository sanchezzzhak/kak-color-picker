<?php namespace kak\widgets\colorpicker;

use yii\helpers\Html;
use yii\helpers\Json;
use yii\widgets\InputWidget;
use kak\widgets\colorpicker\bundles\PickrAsset;
use kak\widgets\colorpicker\bundles\InputGradientAsset;

class InputGradient extends InputWidget
{
    public $theme = '';
    
    
    public function run()
    {
        $this->registerAssets();
    }

    public function registerAssets(): void
    {
        $id = $this->options['id'];

        $view = $this->getView();

        InputGradientAsset::register($view);
        PickrAsset::register($view)->setTheme($this->theme);
        $clientOptions = Json::htmlEncode($this->clientOptions);

        $view->registerJs("jQuery('#{$id}').kakGradientPicker({
            clientOptions: {$clientOptions},
            theme: \"{$this->theme}\"
        });", $view::POS_READY, sprintf(
            "input-gradien-%s", $id
        ));
    }
}