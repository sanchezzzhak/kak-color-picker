<?php namespace kak\widgets\colorpicker;

use yii\helpers\Html;
use yii\helpers\Json;
use yii\widgets\InputWidget;
use kak\widgets\colorpicker\bundles\PickrAsset;
use kak\widgets\colorpicker\bundles\InputGradientAsset;

class InputGradient extends InputWidget
{
    public $theme = '';

    public $clientOptions = [];


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

        $input = $isModel
            ? Html::activeHiddenInput($this->model, $this->attribute, $this->options)
            : Html::hiddenInput($this->name, $this->value, $this->options);


        $contentRange = Html::tag('div', '', [
            'class' => 'ig-ranges-color'
        ]);

        $contanPreview = Html::tag('div', $contentRange, [
            'class' => 'ig-preview-color'
        ]);

        $contantControls = Html::button('add',  [
            'class' => 'btn btn-default ig-btn-add'
        ]);

        echo Html::tag('div',"$input $contanPreview $contantControls", [
            'class' => 'kak-input-gradient'
        ]);
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