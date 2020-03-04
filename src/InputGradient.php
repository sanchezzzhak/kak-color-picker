<?php namespace kak\widgets\colorpicker;

use yii\helpers\Html;
use yii\helpers\Json;
use yii\widgets\InputWidget;
use kak\widgets\colorpicker\bundles\PickrAsset;
use kak\widgets\colorpicker\bundles\InputGradientAsset;

class InputGradient extends InputWidget
{
    public $theme = 'monolith';

    public $createLabel = 'add';
    public $createOptions = [
        'class' => 'btn btn-dark',
    ];


    public $clientOptions = [];


    public function run()
    {
        $this->renderInput();
        $this->registerAssets();
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

        Html::addCssClass($this->createOptions, 'ig-btn-add');
        $contantControls = Html::button($this->createLabel, $this->createOptions);

        $id = $this->options['id'];
        echo Html::tag('div', "$input $contantControls $contanPreview", [
            'id' => $id . "-widget",
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

        $items = [];
        $value = $this->hasModel() ? $this->model->{$this->attribute} : $this->value;
        if ((string)$value !== '') {
            $config = Json::decode($value);
            $items = $config['colors'] ?? [];
        }

        $itemsOptions = Json::htmlEncode($items);
        $jsCode = "
        jQuery('#{$id}-widget').kakGradientPicker({
            clientOptions: {$clientOptions},
            theme: \"{$this->theme}\",
            items: {$itemsOptions},
        }).on('change', function(event, data){
           jQuery('#{$id}').val(JSON.stringify(data));
        });";
        $view->registerJs($jsCode, $view::POS_READY, sprintf(
            "input-gradien-%s", $id
        ));
    }
}