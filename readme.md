ColorPiker widgets for Yii2
------------
The preferred way to install this extension is through [composer](http://getcomposer.org/download/).

Either run

```
php composer.phar require --prefer-dist kak/colorpicker "*"
```

Preview
-
<img src="https://docs.google.com/drawings/d/e/2PACX-1vRCbg40xLkOm-8lAMJUGgEuhkxRDEen1LwsgKd4Rv9zhXz5nH3w0tGfROMHfJhq8jpNmAOIyGFuYYpP/pub?w=314&h=542">

Usage
-
Once the extension is installed, simply use it in your code by  :
```php
<?= $form->field($model, 'color')->widget(InputColor::class, [
   'clientOptions' => [],
   'theme' => InputColor::THEME_MONOLITH,  // default theme
   'addonPreview' => true,  // displays a preview of the color next to the {input}
   // 'addonPreview' => false, // displays the {input} preview in the background and inverts the text color
]); ?>
```

clientOptions 
see js lib https://github.com/Simonwep/pickr#options
