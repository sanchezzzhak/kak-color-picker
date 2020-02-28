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

    public $addonPreview = true;


    public function run()
    {
        $this->registerAssets();
        $this->renderInput();
    }

    public function renderInput(): void
    {
        $isModel = $this->hasModel();
        if (!$isModel && $this->value === null) {
            $this->value = \Yii::$app->request->get($this->name);
        }
        Html::addCssClass($this->options, 'form-control');
        $input = $isModel
            ? Html::activeInput('text', $this->model, $this->attribute, $this->options)
            : Html::textInput($this->name, $this->value, $this->options);

        $template = '<div class="input-group input-color">%s%s</div>';
        if ($this->addonPreview) {
            $addon = '<span class="input-group-addon">&nbsp;&nbsp;&nbsp;</span>';
            echo sprintf($template, $input, $addon);
        } else {
            echo sprintf($template, $input, '');
        }
    }

    public function registerAssets(): void
    {
        $id = $this->options['id'];

        $view = $this->getView();

        InputColorAsset::register($view);
        PickrAsset::register($view)->setTheme($this->theme);

        $clientOptions = Json::htmlEncode($this->clientOptions);
        $addonPreview = $this->boolToStr($this->addonPreview);

        $view->registerJs("jQuery('#{$id}').kakColorPicker({
            clientOptions: {$clientOptions},
            addonPreview: {$addonPreview},
            theme: \"{$this->theme}\"
        });", $view::POS_READY, sprintf(
            "input-color-%s", $id
        ));
    }

    protected function boolToStr($var)
    {
        return $var === true ? 'true' : 'false';
    }
}