import graphene
from .models import Todo
from graphene_django import DjangoObjectType, DjangoListField
from graphql_jwt.decorators import login_required


class TodoType(DjangoObjectType):
    class Meta:
        model = Todo
        fields = ('id', 'title', 'date')


class Query(graphene.ObjectType):
    todos = graphene.List(TodoType, id=graphene.Int())

    @login_required
    def resolve_todos(self, info, id=None):

        if id:
            return Todo.objects.filter(id=id)
        return Todo.objects.all()


class UpdateTodo(graphene.Mutation):
    todo = graphene.Field(TodoType)

    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String(required=True)

    def mutate(self, info, id, title):
        todo = Todo.objects.get(id=id)
        todo.title = title
        todo.save()
        return UpdateTodo(todo=todo)


class CreateTodo(graphene.Mutation):
    todo = graphene.Field(TodoType)

    class Arguments:
        title = graphene.String(required=True)

    def mutate(self, info, title):
        todo = Todo(title=title)
        todo.save()
        return CreateTodo(todo=todo)


class DeleteTodo(graphene.Mutation):
    message = graphene.String()

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id):

        todo = Todo.objects.get(id=id)
        todo.delete()
        return DeleteTodo(message=f"Id {id} delete succes")


class Mutation(graphene.ObjectType):
    create_todo = CreateTodo.Field()
    update_todo = UpdateTodo.Field()
    delete_todo = DeleteTodo.Field()
