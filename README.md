Kasou Meter
===========

Kasou Meter は、あの国民的テレビ番組をモチーフにした発表会支援アプリです。
発表にリアルタイムに点数をつけて遊ぶことができます。

![meter.png](https://raw.github.com/wiki/HumourStudio/kasou-meter/images/meter.png "meter.png")

![client.png](https://raw.github.com/wiki/HumourStudio/kasou-meter/images/client.png "client.png")

Quick Start
-----------

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Demo
----
得点ページ：[kasou-meter.herokuapp.com/meter](http://kasou-meter.herokuapp.com/meter)

審査員ページ：[kasou-meter.herokuapp.com](http://kasou-meter.herokuapp.com/)

How To Use
----------
1. アプリをサーバーにデプロイします

2. `http://アプリURL/`にアクセスします

3. 審査員は手持ちの端末（スマートフォンなど）から`http://アプリURL/meter/`にアクセスします

4. 審査員は、端末に表示された電球ボタンを押して点数を入れます

5. 合格点に到達すればクリアです

6. `reset`ボタンを押すと、メーターと電球ボタンが初期化されます


How To Deploy To Heroku
-----------------------
[Heroku](https://www.heroku.com/)を使うと、Kasou Meter を簡単に使い始めることができます。

1. [Heroku](https://www.heroku.com/)のアカウントを取得します

2. [Heroku ToolBelt](https://toolbelt.heroku.com)をインストールします

3. `git clone git@github.com:HumourStudio/kasou-meter.git`

4. `heroku apps:create your-app-name`

5. `heroku labs:enable websockets -a your-app-name`

6. `git push heroku master`

