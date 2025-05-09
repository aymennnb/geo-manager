<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'site_id' => 'required|exists:sites,id',
            'uploaded_by' => 'required|exists:users,id',
            'file_path' => 'required|file|mimes:pdf,doc,docx,xls,csv,xlsx,png,jpg,jpeg|max:20480',
            'expiration_date' => 'nullable|date|after_or_equal:today'
        ];
    }
}
