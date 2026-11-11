@extends('errors.layout')

@section('code', '500')
@section('art', 'file')
@section('tone', 'red')
@section('title', __('Something went wrong'))
@section('message', __('The panel ran into an unexpected error. Try again in a moment; if it keeps happening, contact the administrator.'))

@section('actions')
    <a class="btn btn-primary" href="javascript:location.reload()">{{ __('Try again') }}</a>
    <a class="btn btn-ghost" href="/">{{ __('Back to the panel') }}</a>
@endsection
