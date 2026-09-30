  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Temporary shortcut for testing your portal interface
      if (email === 'student@rit.edu' || email === 'teacher@rit.edu') {
        setTimeout(() => {
          alert(`Demo Success! Logged in as ${role}`);
          setLoading(false);
          // TODO: Load your student or teacher dashboard state here
        }, 500);
        return;
      }

      // Real Supabase Query
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('role', role)
        .single();

      if (error || !data) {
        alert('Invalid login credentials or role mismatch. Please try again.');
      } else {
        alert(`Successfully logged in as ${data.role}: ${data.email}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };
