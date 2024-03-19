<template>
  <n-form
    ref="formRef"
    inline
    :label-width="80"
    :model="formValue"
    :rules="rules"
    :size="size"
  >
    <n-form-item label="Title" path="title">
      <n-input v-model:value="formValue.title" placeholder="Input title" />
    </n-form-item>
    <n-form-item>
      <n-button style="background-color: blanchedalmond" @click="handleCreate">
        Создать
      </n-button>
    </n-form-item>
  </n-form>
  <n-data-table
    :key="(row) => row.id"
    :columns="column"
    :data="todos?.todos || []"
    :pagination="false"
    :bordered="false"
    :loading="deleteLoading"
  />
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import moment from "moment";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { NButton, useMessage, NInput } from "naive-ui";
import { computed, reactive, ref, h, defineComponent, nextTick } from "vue";
const getDataIndex = (id) => {
  return todos.value.todos.findIndex((item) => item.id === id);
};
const formValue = ref({
  title: "",
});
function handleCreate(e) {
  create({ title: formValue.value.title });
  formValue.value.title = "";
}
const ShowOrEdit = defineComponent({
  props: {
    value: [String, Number],
    onUpdateValue: [Function, Array],
  },
  setup(props) {
    const isEdit = ref(false);
    const inputRef = ref(null);
    const inputValue = ref(props.value);
    function handleOnClick() {
      isEdit.value = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    }
    function handleChange() {
      props.onUpdateValue(inputValue.value);
      isEdit.value = false;
    }
    return () =>
      h(
        "div",
        {
          style: "min-height: 22px",
          onClick: handleOnClick,
        },
        isEdit.value
          ? h(NInput, {
              ref: inputRef,
              value: inputValue.value,
              onUpdateValue: (v) => {
                inputValue.value = v;
              },
              onChange: handleChange,
            })
          : props.value
      );
  },
});
// const updateTodo = (row) => {
//   console.log(row);
// };

const column = reactive([
  {
    title: "No",
    key: "id",
  },
  {
    title: "Title",
    key: "title",
    render(row) {
      const index = getDataIndex(row.id);
      return h(ShowOrEdit, {
        value: row.title,
        onUpdateValue: async (v) => {
          console.log(todos.value.todos[index].title);
          await updateData({
            id: Number(todos.value.todos[index].id),
            title: String(v),
          });
        },
      });
    },
  },
  {
    title: "Action",
    key: "actions",
    render(row) {
      return h("div", [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => del({ id: Number(row.id) }),
          },
          { default: () => "Delete" }
        ),
      ]);
    },
  },
]);

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      todo {
        id
        title
        date
      }
    }
  }
`;
const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      message
    }
  }
`;
const UPDATE_TODO = gql`
  mutation UpdateTodo($id: Int!, $title: String!) {
    updateTodo(id: $id, title: $title) {
      todo {
        id
        title
      }
    }
  }
`;
const TODOS = gql`
  {
    todos {
      id
      title
      date
    }
  }
`;
const { result: todos, refetch } = useQuery(TODOS);

const {
  mutate: create,
  onDone: onCreateTodoDone,
  loading: createLoading,
} = useMutation(CREATE_TODO, {
  variables: () => ({
    title: title.value,
  }),
  update(cache, { data: { createTodo } }) {
    const data = cache.readQuery({ query: TODOS });
    cache.writeQuery({
      query: TODOS,
      data: {
        ...data,
        todos: [...data.todos, createTodo],
      },
    });
  },
});
const {
  mutate: del,
  onDone: onDeleteTodoDone,
  loading: deleteLoading,
} = useMutation(DELETE_TODO, {
  update(cache, { data: { deleteTodo } }) {
    const data = cache.readQuery({ query: TODOS });
    cache.writeQuery({
      query: TODOS,
      data: {
        ...data,
        todos: [...data.todos, deleteTodo],
      },
    });
  },
});
const {
  mutate: updateData,
  onDone: onUpdateDone,
  loading: updateLoading,
} = useMutation(UPDATE_TODO);
</script>
