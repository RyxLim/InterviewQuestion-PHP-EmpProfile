<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $filePath = storage_path('app/exports/employees.csv');

        // Check if file exists
        if (!file_exists($filePath)) {
            return response()->json([
                'message' => 'No employees found'
            ], 404);
        }

        $fileContent = file_get_contents($filePath);

        // If fileContent is empty, return no results
        if (empty($fileContent)) {
            return response()->json([
                'message' => 'No employees found'
            ], 404);
        }

        $employees = json_decode($fileContent, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'message' => 'Error reading employees data'
            ], 500);
        }

        // $employees = Employee::all();

        return response()->json([
            'message' => 'Employees retrieved successfully',
            'data' => $employees
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $this->validateData($request);

        $filePath = 'exports/employees.csv';

        if (Storage::exists($filePath)) {
            $existingData = json_decode(Storage::get($filePath), true);

            // Check if the myKad alreeady exists
            $employeeExists = collect($existingData)->firstWhere('myKad', $validatedData['myKad']);
            if ($employeeExists) {
                return response()->json([
                    'message' => 'Employee already exists',
                    'data' => $employeeExists
                ], 409);
            }

            // Determine next available ID
            $lastEmployee = collect($existingData)->last();
            $nextId = isset($lastEmployee['id']) ? $lastEmployee['id'] + 1 : 1;
        } else {
            $existingData = [];
            $nextId = 1;
        }

        $validatedData['id'] = $nextId;

        $existingData[] = $validatedData;

        Storage::put($filePath, json_encode($existingData, JSON_PRETTY_PRINT));

        // Insert into DB as well
        Employee::create($validatedData);

        return response()->json([
            'message' => 'Employee created successfully',
            'data' => $validatedData
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $filePath = storage_path('app/exports/employees.csv');

            if (!file_exists($filePath)) {
                return response()->json([
                    'message' => 'No employees found'
                ], 404);
            }

            // Validate the incoming request
            $validatedData = $this->validateData($request);

            $fileContent = file_get_contents($filePath);
            $employees = json_decode($fileContent, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'message' => 'Error decoding employees data'
                ], 500);
            }

            // Find the emp to update
            $employeeIndex = null;
            foreach ($employees as $index => $employee) {
                if ($employee['id'] == $id) {
                    $employeeIndex = $index;
                    break;
                }
            }

            if ($employeeIndex === null) {
                return response()->json([
                    'message' => 'Employee not found'
                ], 404);
            }

            $employees[$employeeIndex] = array_merge($employees[$employeeIndex], $validatedData);

            file_put_contents($filePath, json_encode(array_values($employees), JSON_PRETTY_PRINT));

            // DB EDIT
            // $employee = Employee::findOrFail($id);

            // $validatedData = $this->validateData($request);
            
            // $employee->update($validatedData);

            return response()->json([
                'message' => 'Employee updated successfully'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Employee not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message'=> 'An error occurred while updating employee'
            ],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $filePath = storage_path('app/exports/employees.csv');

            if (!file_exists($filePath)) {
                return response()->json([
                    'message' => 'No employees found'
                ], 404);
            }

            $fileContent = file_get_contents($filePath);

            $employees = json_decode($fileContent, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'message' => 'Error decoding employees data'
                ], 500);
            }

            $filteredEmployees = array_filter($employees, function ($employee) use ($id) {
                return $employee['id'] != $id;
            });

            if (count($filteredEmployees) === count($employees)) {
                return response()->json([
                    'message' => 'Employee not found'
                ], 404);
            }

            // DB Delete
            // $employee = Employee::findOrFail($id);
            // $employee->delete();

            file_put_contents($filePath, json_encode(array_values($filteredEmployees), JSON_PRETTY_PRINT));

            return response()->json(['message' => 'Employee deleted successfully.'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message'=> 'Employee not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message'=> 'An error occurred while deleting employee'
            ],500);
        }
    }

    private function validateData($request)
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'myKad' => 'required|string|max:50|unique:employees,myKad',
            'gender' => 'required|in:Male,Female,Other',
            'maritalStatus' => 'required|in:Single,Married,Divorced,Widowed',
            'phone' => 'required|string|max:15',
            'email' => 'required|email|max:255',
            'address' => 'required|string',
            'dateOfBirth' => 'required|date',
            'nationality' => 'required|string',
            'hireDate' => 'required|date',
            'department' => 'required|in:HR,Engineering,Marketing',
        ]);
    }
}
