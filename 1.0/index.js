/**
 * @fileoverview 请修改组件描述
 * @author bachi<bachi@taobao.com>
 * @module photoswipe
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 请修改组件描述
     * @class Photoswipe
     * @constructor
     * @extends Base
     */
    function Photoswipe(comConfig) {
        var self = this;
        //调用父类构造函数
        Photoswipe.superclass.constructor.call(self, comConfig);
    }
    S.extend(Photoswipe, Base, /** @lends Photoswipe.prototype*/{

    }, {ATTRS : /** @lends Photoswipe*/{

    }});
    return Photoswipe;
}, {requires:['node', 'base']});



