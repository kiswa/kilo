'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">
                        <img alt="" class="img-responsive" data-type="compodoc-logo" data-src=images/logo.png> 
                    </a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Animations.html" data-type="entity-link">Animations</a>
                            </li>
                            <li class="link">
                                <a href="classes/Assets.html" data-type="entity-link">Assets</a>
                            </li>
                            <li class="link">
                                <a href="classes/BufferInfo.html" data-type="entity-link">BufferInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/Camera.html" data-type="entity-link">Camera</a>
                            </li>
                            <li class="link">
                                <a href="classes/CanvasRenderer.html" data-type="entity-link">CanvasRenderer</a>
                            </li>
                            <li class="link">
                                <a href="classes/Container.html" data-type="entity-link">Container</a>
                            </li>
                            <li class="link">
                                <a href="classes/Entity.html" data-type="entity-link">Entity</a>
                            </li>
                            <li class="link">
                                <a href="classes/Game.html" data-type="entity-link">Game</a>
                            </li>
                            <li class="link">
                                <a href="classes/GamepadControls.html" data-type="entity-link">GamepadControls</a>
                            </li>
                            <li class="link">
                                <a href="classes/GlBuffer.html" data-type="entity-link">GlBuffer</a>
                            </li>
                            <li class="link">
                                <a href="classes/GLUtils.html" data-type="entity-link">GLUtils</a>
                            </li>
                            <li class="link">
                                <a href="classes/HitBox.html" data-type="entity-link">HitBox</a>
                            </li>
                            <li class="link">
                                <a href="classes/KeyControls.html" data-type="entity-link">KeyControls</a>
                            </li>
                            <li class="link">
                                <a href="classes/MouseControls.html" data-type="entity-link">MouseControls</a>
                            </li>
                            <li class="link">
                                <a href="classes/OneUp.html" data-type="entity-link">OneUp</a>
                            </li>
                            <li class="link">
                                <a href="classes/Particle.html" data-type="entity-link">Particle</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParticleEmitter.html" data-type="entity-link">ParticleEmitter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rect.html" data-type="entity-link">Rect</a>
                            </li>
                            <li class="link">
                                <a href="classes/Renderer.html" data-type="entity-link">Renderer</a>
                            </li>
                            <li class="link">
                                <a href="classes/Scene.html" data-type="entity-link">Scene</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShaderProgram.html" data-type="entity-link">ShaderProgram</a>
                            </li>
                            <li class="link">
                                <a href="classes/Sound.html" data-type="entity-link">Sound</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoundGroup.html" data-type="entity-link">SoundGroup</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoundPool.html" data-type="entity-link">SoundPool</a>
                            </li>
                            <li class="link">
                                <a href="classes/Sprite.html" data-type="entity-link">Sprite</a>
                            </li>
                            <li class="link">
                                <a href="classes/State.html" data-type="entity-link">State</a>
                            </li>
                            <li class="link">
                                <a href="classes/Text.html" data-type="entity-link">Text</a>
                            </li>
                            <li class="link">
                                <a href="classes/Texture.html" data-type="entity-link">Texture</a>
                            </li>
                            <li class="link">
                                <a href="classes/TileMap.html" data-type="entity-link">TileMap</a>
                            </li>
                            <li class="link">
                                <a href="classes/TileSprite.html" data-type="entity-link">TileSprite</a>
                            </li>
                            <li class="link">
                                <a href="classes/Timer.html" data-type="entity-link">Timer</a>
                            </li>
                            <li class="link">
                                <a href="classes/Trigger.html" data-type="entity-link">Trigger</a>
                            </li>
                            <li class="link">
                                <a href="classes/Vec.html" data-type="entity-link">Vec</a>
                            </li>
                            <li class="link">
                                <a href="classes/WebAudio.html" data-type="entity-link">WebAudio</a>
                            </li>
                            <li class="link">
                                <a href="classes/WebGLRenderer.html" data-type="entity-link">WebGLRenderer</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Controls.html" data-type="entity-link">Controls</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExtraLayer.html" data-type="entity-link">ExtraLayer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Hits.html" data-type="entity-link">Hits</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Layer.html" data-type="entity-link">Layer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Map.html" data-type="entity-link">Map</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Object.html" data-type="entity-link">Object</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ParticleOptions.html" data-type="entity-link">ParticleOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Point.html" data-type="entity-link">Point</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Property.html" data-type="entity-link">Property</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RectStyleOptions.html" data-type="entity-link">RectStyleOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Resolution.html" data-type="entity-link">Resolution</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Scripts.html" data-type="entity-link">Scripts</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SoundOptions.html" data-type="entity-link">SoundOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TextOptions.html" data-type="entity-link">TextOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tile.html" data-type="entity-link">Tile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TiledMap.html" data-type="entity-link">TiledMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tileset.html" data-type="entity-link">Tileset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VecEntity.html" data-type="entity-link">VecEntity</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="unit-test.html"><span class="icon ion-ios-podium"></span>Unit test coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});