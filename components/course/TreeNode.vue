<template>
	<view class="courseTree-node" @click.stop v-show="node.visible" :class="{'is-expanded': expanded,'is-current': node.isCurrent,'is-hidden': !node.visible,'is-disabled': node.disabled,}" role="treeitem">
		<view class="courseTree-node__content" :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }" @click.stop="handleContentClick">
			<view @click.stop="handleExpandIconClick" :class="[ { 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded }, 'courseTree-node__expand-icon', ]">
				<uni-icons v-if="!node.isLeaf" type="right" size="16" />
			</view>
			<view class="courseTree-node__label" v-if="node.module == 'dirs'">
				{{node.coursetitle}}
			</view> 
			<view class="courseTree-node__label" v-else>
				<navigator open-type="redirect" :url="url" hover-class="none">
					<view class="intro paddinglr">
						<span :class="['fa',icons?.[node.module]]" :style="{color:node.iscurrent?'#2979ff':'#999999'}"></span>
						{{node.coursetitle}}
						<span class="pull-right more">
							<span v-if="node.logstatus == 1">已学完</span>
							<span v-else-if="node.logprogress > 0">
								上次学到<span v-if="Math.trunc(node.logprogress / 60) > 0">{{Math.trunc(node.logprogress / 60)}}分</span>{{Math.trunc(node.logprogress % 60)}}秒
							</span>
							<span v-else>未学习</span>
						</span>
					</view>
				</navigator>
			</view>
		</view>
		<view class="courseTree-node__children" v-if="!renderAfterExpand || childNodeRendered" v-show="expanded" role="group">
			<TreeNode v-for="child in node.childNodes" :key="getNodeKey(child)" :node="child" :render-after-expand="renderAfterExpand" :expand-on-click-node="expandOnClickNode" @node-expand="handleChildNodeExpand" @node-select="handleChildNodeSelect" />
		</view>
	</view>
</template>

<script>
// #ifdef MP
import TreeNode from "./TreeNode.vue";
// #endif

export default {
	name: "TreeNode",
	props: {
		node: {
			type: Object,
			required: true,
		},
		renderAfterExpand: {
			type: Boolean,
			default: true,
		},
		expandOnClickNode: {
			type: Boolean,
			default: true,
		},
	},
	// #ifdef MP
	components: {
		TreeNode,
	},
	// #endif

	inject: ["tree"],
	data() {
		return {
			expanded: this.node.expanded || false,
			childNodeRendered: false,
			icons:{
				'dirs':'',
				'course':'fa-circle-play',
				'pdf':'fa-file',
			},
			url:''
		};
	},
	created() {
		this.node.expand = this.expand;
		this.node.collapse = this.collapse;

		if (this.node.expanded) {
			this.childNodeRendered = true;
		}
		let url = this.node.module == 'pdf'?'/pages/course/course_pdf?csid=':'/pages/course/course?csid=';
		this.url = url + this.node.csid + '&videoid=' + this.node.courseid;
	},
	watch: {
		"node.expanded"(val) {
			this.expanded = val;
				if (val && !this.childNodeRendered) {
				this.childNodeRendered = true;
			}
		},
	},
	methods: {
		getNodeKey(node) {
			return node.data[this.tree.nodeKey] || node.id;
		},
		handleContentClick() {
			if (this.expandOnClickNode) {
				if (this.node.isLeaf) {
					// 叶子节点 => 选中
					this.selectNode();
				} else {
					// 父节点 => 展开/折叠，不选中
					this.handleExpandIconClick();
				}
			} else {
				// 无论是否为叶子节点 => 选中，不展开
				this.selectNode();
			}
			this.tree.emit("node-click", this.node.data, this.node);
		},
		handleExpandIconClick() {
			if (this.node.isLeaf) return;
			this.expanded ? this.collapse() : this.expand();
		},
		expand() {
			this.expanded = true;
			this.node.expanded = true;
			if (!this.childNodeRendered) {
				this.childNodeRendered = true;
			}
			this.$emit("node-expand", this.node.data, this.node);
			this.tree.emit("node-expand", this.node.data, this.node);
		},
		collapse() {
			this.expanded = false;
			this.node.expanded = false;
			this.tree.emit("node-collapse", this.node.data, this.node);
		},
		selectNode() {
			if (this.node.disabled) return;
			this.tree.store.setCurrentNode(this.node);
			this.$emit("node-select", this.node);
			this.tree.emit("node-select", this.node.data, this.node);
		},
		handleChildNodeExpand(data, node) {
			this.$emit("node-expand", data, node);
		},
		handleChildNodeSelect(node) {
			this.$emit("node-select", node);
		},
	},
};
</script>

<style scoped lang="scss">
.courseTree-node {
	width: 100%;
}

.courseTree-node__content {
	display: flex;
	align-items: center;
	height: 44px;
	line-height: 44px;
}

.courseTree-node__expand-icon {
	margin-right: 8px;
	display: inline-flex;
	align-items: center;
	transition: transform 0.3s;
	cursor: pointer;
}

.courseTree-node__expand-icon.expanded {
	transform: rotate(90deg);
}

.courseTree-node__loading-icon {
	margin-right: 8px;
	display: inline-flex;
	align-items: center;
}

.courseTree-node__label {
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-left: 5px;
	border-bottom: 1px solid #F5F5F5;
}

.courseTree-node__children {
	overflow: hidden;
}

.is-current .courseTree-node__label {
	color: #409eff;
	font-weight: bold;
}

.is-hidden {
	display: none;
}

.is-disabled {
	color: #ababab;
}
</style>
