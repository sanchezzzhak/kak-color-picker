<?php namespace kak\widgets\colorpicker;

use yii\helpers\Html;
use yii\helpers\Json;
use yii\widgets\InputWidget;
use kak\widgets\colorpicker\bundles\PickrAsset;
use kak\widgets\colorpicker\bundles\InputColorAsset;

class InputColor extends InputWidget
{
    public const THEME_NANO = 'nano';
    public const THEME_MONOLITH = 'monolith';
    public const THEME_CLASSIC = 'classic';

    public $theme = 'monolith';
    public $clientOptions = [];
    
    public function run()
    {
        $this->registerAssets();
        $this->renderInput();
    }

    public function renderInput() : void
    {
        $isModel = $this->hasModel();
        if (!$isModel && $this->value === null) {
            $this->value = \Yii::$app->request->get($this->name);
        }
        Html::addCssClass($this->options, 'form-control');
        $input = $isModel
            ? Html::activeInput('text', $this->model, $this->attribute, $this->options)
            : Html::textInput($this->name, $this->value, $this->options);

        echo sprintf('<div class="input-group input-color">%s<span class="input-group-addon">&nbsp;&nbsp;&nbsp;</span></div>', $input);
    }

    public function registerAssets(): void
    {
        $id = $this->options['id'];

        $view = $this->getView();
        
        PickrAsset::register($view)->setTheme($this->theme);
        InputColor::register($view);
        $view->registerJs($this->getJsPluginCode(), $view::POS_READY, 'input-widget-color-init');
        
        $clientOptions = Json::htmlEncode($this->clientOptions);
        
        $view->registerJs("jQuery('#{$id}').kakColorPicker({$clientOptions});", $view::POS_READY, sprintf(
            "input-color-%s", $id
        ));
    }



}