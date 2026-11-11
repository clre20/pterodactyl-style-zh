@extends('errors.layout')

@section('code', '503')
@section('art', 'gear')
@section('tone', 'amber')
@section('title', __('Under maintenance'))
@section('message', __('The panel is being updated and will be back shortly.'))

@section('actions')
    <a class="btn btn-primary" href="javascript:location.reload()">{{ __('Try again') }}</a>
@endsection
